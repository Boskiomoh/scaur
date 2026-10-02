import type { FC } from "react";

import Button from "@/components/ui/button";

interface CheckoutNoticeProps {
  checkoutUrl: string;
  onBack: () => void;
}

const CheckoutNotice: FC<CheckoutNoticeProps> = ({ checkoutUrl, onBack }) => (
  <div className="flex grow flex-col gap-5 overflow-y-auto px-4 py-8 md:px-6">
    <h3 className="font-display text-sheet-title">This is a test checkout</h3>
    <p className="text-base leading-relaxed text-ink-2">
      Scaur is a demo store. Next is Shopify&apos;s real checkout in test mode.
      You don&apos;t need to place the order; no card is ever charged and
      nothing ships.
    </p>
    <span className="text-nav font-semibold">
      If you want to try a test order
    </span>
    <dl className="grid grid-cols-notice gap-y-3 text-nav">
      <dt className="text-ink-2">Card number</dt>
      <dd className="font-data">1</dd>
      <dt className="text-ink-2">Expiry</dt>
      <dd>Any future date</dd>
      <dt className="text-ink-2">Security code</dt>
      <dd>Any 3 digits</dd>
      <dt className="text-ink-2">Store password</dt>
      <dd className="font-data">{process.env.NEXT_PUBLIC_STORE_PASSWORD}</dd>
    </dl>
    <p className="text-sm text-ink-2">
      Development stores are private, so Shopify may ask for the store password
      first. It then brings you back here; press Continue to checkout again.
    </p>
    <div className="mt-auto flex flex-col gap-2.5">
      <Button href={checkoutUrl} size="lg">
        Continue to checkout
      </Button>
      <Button variant="secondary" size="lg" onClick={onBack}>
        Back to cart
      </Button>
    </div>
  </div>
);

export default CheckoutNotice;
