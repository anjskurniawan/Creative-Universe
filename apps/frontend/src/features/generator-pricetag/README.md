# Pricetag Generator Feature

- Page routes: `/generator/pricetag`, `/generator/pricetag/catalog`, `/generator/pricetag/history`, and `/generator/pricetag/search`.
- API prefix: `/api/v1/generator/pricetag`.
- Status: active.
- Ownership: category, product, import, generation, batch, history, search, preview, dan download Pricetag.

Public API module: `api/index.ts` (`pricetagApi`). DTO, form contracts, Rupiah formatting, and API/validation error mapping are owned by `types/index.ts`. The shared tabbed route layout lives in `components/PricetagLayout/`; one-page implementations remain route-local.
