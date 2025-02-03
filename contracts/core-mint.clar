;; CoreMint NFT Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-exists (err u102))
(define-constant err-invalid-token (err u103))
(define-constant err-listing-not-found (err u104))

;; Define NFT token
(define-non-fungible-token core-mint-nft uint)

;; Data Variables
(define-data-var token-count uint u0)
(define-data-var mint-price uint u10000000) ;; 10 STX
(define-data-var max-supply uint u1000) ;; Maximum token supply

;; Data Maps
(define-map token-metadata uint (string-utf8 256))

;; Public Functions
(define-public (mint (metadata (string-utf8 256)))
  (let
    (
      (token-id (+ (var-get token-count) u1))
    )
    (asserts! (< (var-get token-count) (var-get max-supply)) (err u105))
    (asserts! (is-eq (stx-transfer? (var-get mint-price) tx-sender contract-owner) (ok true)) (err u1))
    (try! (nft-mint? core-mint-nft token-id tx-sender))
    (map-set token-metadata token-id metadata)
    (var-set token-count token-id)
    (ok token-id)))

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u1))
    (nft-transfer? core-mint-nft token-id sender recipient)))

;; Read only functions  
(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-metadata token-id)))

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? core-mint-nft token-id)))

(define-read-only (get-token-count)
  (ok (var-get token-count)))

(define-read-only (get-max-supply)
  (ok (var-get max-supply)))

;; Admin functions
(define-public (set-max-supply (new-max-supply uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set max-supply new-max-supply)
    (ok true)))
