# Auction Platform — Build Spec & Roadmap

Real-time auction marketplace: an **admin** lists products with a starting price and a scheduled auction window; when bidding opens, any logged-in user can bid; when it closes, the top bidder must pay within a limited window to own the item.

> Checkbox state reflects what's **decided/planned**. Unchecked = not built yet.

## Key decisions (agreed)

| Topic | Decision |
| --- | --- |
| Auction window | Admin sets explicit `auctionStartsAt` and `auctionEndsAt` |
| Minimum bid | Admin-set starting price (first bid must be ≥ it) |
| Bid increment | Any strictly-higher amount (no fixed increment) |
| Anti-sniping | A new-highest bid inside the final 30s extends the end time by +30s (from the current end time) |
| End of bidding | Auto-close at end time (with anti-sniping extensions) |
| Winner selection | Highest bidder at close |
| Payment window | Top 100 bidders each get **5 minutes** (flat), cascading down the ranking if the higher bidder fails |
| No-pay penalty | Failed payer's **tie-break priority score** is lowered for future same-instant/amount ties |
| Payment provider | **Stripe (test mode)**, Payment Intent checkout |
| Currency | **Display in NPR**, charge in **USD** (fixed documented FX rate; Stripe does not settle NPR) |
| Notifications | RabbitMQ pipeline (extends existing reminders): outbid, won, payment-window-open, payment-success |
| Bid eligibility | Any logged-in user, including admin |
| Frontends | Web control-room = **admin**; Expo **mobile** = bidding users |

## Product lifecycle

```
SCHEDULED ──(auctionStartsAt)──▶ LIVE ──(auctionEndsAt + anti-sniping)──▶ ENDED
                                                                    │
                                    ┌───────────────────────────────┘
                                    ▼
                        winner pays within 5 min? ──yes──▶ SOLD
                                    │
                                    no (penalty)
                                    ▼
                        next bidder (2nd, then 3rd … up to 100) gets 5 min
                                    │
                                    no one pays
                                    ▼
                              FAILED → admin re-lists
```

---

## 1. Product management (admin web)

- [x] Web control-room shell: login, register, role gate, header/nav
- [x] Add `auctionEndsAt` (DateTime) and `startingPrice` (Decimal, NPR) to `Product` + migration
- [x] Create product form: name, image URL, starting price, `auctionStartsAt`, `auctionEndsAt`
- [x] Edit product form (same fields, pre-filled)
- [x] Delete product
- [x] Product list with status badge (SCHEDULED / LIVE / ENDED)
- [x] Validation: `auctionEndsAt` > `auctionStartsAt`; starting price ≥ 0

## 2. Bidding engine

- [ ] `Bid` model: product, user, amount, timestamp; indexed by (product, amount desc)
- [ ] Place bid: must be logged in, product LIVE, amount strictly higher than current highest, first bid ≥ starting price
- [ ] Anti-sniping: new-highest bid within final 30s → `auctionEndsAt = now + 30s` (persisted)
- [ ] Same-instant, equal-amount tie → higher tie-break priority score wins
- [ ] `priorityScore` per user (default high; lowered on no-pay)
- [ ] Auto-close job (scheduler) transitions LIVE → ENDED and snapshots ranked top-100 bids
- [ ] Public API: list live auctions, get product + current price, place bid

## 3. Settlement & payment (Stripe test mode)

- [ ] On ENDED, build ranked bidder list (top 100)
- [ ] Payment windows cascade: 1st 5 min → fail → 2nd 5 min → … → 100th
- [ ] Scheduler drives window transitions + expiry
- [ ] Stripe Payment Intent checkout (amount in USD via documented FX)
- [ ] On success → `SOLD` (winner recorded); all windows expired → `FAILED`
- [ ] Non-payer gets `priorityScore` penalty applied
- [ ] Webhook/confirmation handling for payment success

## 4. Notifications (RabbitMQ pipeline)

- [x] Auction-start reminders (BEFORE_START / AT_START) already working
- [ ] **Outbid** — user is no longer the highest bidder
- [ ] **Auction won** — you are the highest bidder at close
- [ ] **Payment window open** — you now have 5 min to pay
- [ ] **Payment success** — purchase confirmed
- [ ] Notifier implementations for each event kind (web + mobile push-ready)

## 5. Frontends

### 5.1 Web control-room (admin)
- [x] Auth (login/register), role gate, shell
- [x] Product list, create, edit views (UI built; needs `auctionEndsAt` + `startingPrice` fields + backend)
- [ ] Delete + status badges
- [ ] (Stretch) simple auction overview: live count, ended/revenue

### 5.2 Mobile (Expo React Native) — bidding users
- [x] Project scaffold (Expo app in `apps/mobile`): SDK 57, expo-router, TS, monorepo wiring (Metro watchFolders + shared zod schemas)
- [x] Auth screens (login/register via `/login` + `/register`, JWT in expo-secure-store)
- [ ] Browse live auctions (list + detail, current price, countdown)
- [ ] Place bid (with amount validation)
- [ ] My bids / won items
- [ ] Payment screen (Stripe) with 5-min countdown
- [ ] Notifications (outbid, won, payment window)

## 6. Open questions / follow-ups

- [ ] FX rate source for NPR→USD (fixed constant for demo?)
- [ ] Whether reminders should extend to mobile push or stay in-app
- [ ] Admin re-list flow after FAILED (new auction window + starting price?)
- [ ] Race-condition strategy for same-instant bids (DB lock vs timestamp tie-break)
- [ ] Whether bidding needs an increment UI hint (e.g., min next bid shown on mobile)