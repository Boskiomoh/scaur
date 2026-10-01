"use client";

import { XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState, type FC, type MouseEvent } from "react";

import { getCart, removeLine, updateLine } from "@/components/cart/actions";
import CartLine from "@/components/cart/cart-line";
import CheckoutNotice from "@/components/cart/checkout-notice";
import { withQuantity } from "@/components/cart/with-quantity";
import Button from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import type { CartLine as CartLineData } from "@/types/cart";

const CartDrawer: FC = () => {
  // Stores
  const isOpen = useCartStore((state) => state.isOpen);
  const cart = useCartStore((state) => state.cart);
  const lineErrors = useCartStore((state) => state.lineErrors);
  const close = useCartStore((state) => state.close);
  const setCart = useCartStore((state) => state.setCart);
  const setLineError = useCartStore((state) => state.setLineError);

  // State
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"review" | "confirm">("review");
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  // Derived
  const lines = cart?.lines ?? [];
  const groups = [
    ...lines
      .reduce((map, line) => {
        const key = line.kit?.id ?? "loose";
        return map.set(key, [...(map.get(key) ?? []), line]);
      }, new Map<string, CartLineData[]>())
      .values(),
  ];
  const isEmpty = lines.length === 0;

  // Effects
  // Pages stay static, so the cart (kept on Shopify, keyed by a cookie) loads after hydration.
  useEffect(() => {
    getCart().then((result) => setCart(result.cart));
  }, [setCart]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog?.open) dialog?.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  // Handlers
  const handleClose = () => {
    close();
    setStep("review");
  };

  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) handleClose();
  };

  const handleQuantity = async (line: CartLineData, quantity: number) => {
    if (!cart) return;
    const previous = cart;
    setLineError(line.id);
    setCart(withQuantity(cart, line.id, quantity));
    setPendingIds((ids) => [...ids, line.id]);
    const result =
      quantity === 0
        ? await removeLine(line.id)
        : await updateLine(line.id, quantity);
    setPendingIds((ids) => ids.filter((id) => id !== line.id));
    if (result.ok) {
      setCart(result.cart);
    } else {
      setCart(result.cart ?? previous);
      setLineError(line.id, result.error);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-heading"
      onClose={handleClose}
      onClick={handleBackdrop}
      className="m-0 ms-auto h-dvh max-h-none w-full max-w-none flex-col bg-snow text-ink transition-transform duration-220 ease-out backdrop:bg-ink/50 open:flex starting:open:translate-x-full lg:w-120"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line ps-4 pe-2 md:h-18 md:px-6">
        <h2 id="cart-heading" className="font-display text-2xl">
          Cart{" "}
          <span className="font-data text-base font-medium normal-case">
            ({cart?.totalQuantity ?? 0})
          </span>
        </h2>
        <button
          type="button"
          aria-label="Close cart"
          onClick={handleClose}
          className="flex size-11 items-center justify-center rounded-full"
        >
          <XIcon aria-hidden="true" className="size-5" />
        </button>
      </div>

      {isEmpty && (
        <div className="flex grow flex-col gap-4 px-4 py-12 md:px-6">
          <h3 className="font-display text-sheet-title">Your cart is empty</h3>
          <p className="text-base text-ink-2">
            Start with a layer, or let the kit builder put a whole system
            together.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button href="/kit" size="lg" onClick={handleClose}>
              Build your kit
            </Button>
            <Button
              href="/shop"
              variant="secondary"
              size="lg"
              onClick={handleClose}
            >
              Shop layers
            </Button>
          </div>
        </div>
      )}

      {!isEmpty && step === "confirm" && cart && (
        <CheckoutNotice
          checkoutUrl={cart.checkoutUrl}
          onBack={() => setStep("review")}
        />
      )}

      {!isEmpty && step === "review" && cart && (
        <>
          <div className="grow overflow-y-auto px-4 py-2 md:px-6">
            {groups.map((group) => {
              const kit = group[0].kit;
              return (
                <div
                  key={kit?.id ?? "loose"}
                  className="border-b border-line py-4 md:max-lg:py-3"
                >
                  {kit && (
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-sm font-semibold">
                        Kit: {kit.label}
                      </span>
                      <Link
                        href={kit.url}
                        onClick={handleClose}
                        className="text-sm"
                      >
                        Edit kit
                      </Link>
                    </div>
                  )}
                  <ul>
                    {group.map((line) => (
                      <CartLine
                        key={line.id}
                        line={line}
                        error={lineErrors[line.id]}
                        isPending={pendingIds.includes(line.id)}
                        onQuantity={(quantity) =>
                          handleQuantity(line, quantity)
                        }
                        onNavigate={handleClose}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="flex shrink-0 flex-col gap-3.5 border-t border-line px-4 pt-5 pb-6 md:px-6">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-semibold">Subtotal</span>
              <span className="font-data text-xl font-semibold">
                {formatMoney(cart.subtotal)}
              </span>
            </div>
            <span className="text-sm text-ink-2">
              Shipping and taxes are worked out at checkout.
            </span>
            <Button size="lg" onClick={() => setStep("confirm")}>
              Checkout
            </Button>
          </div>
        </>
      )}
    </dialog>
  );
};

export default CartDrawer;
