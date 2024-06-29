import {
  useApi,
  reactExtension,
  useCartLines,
  useApplyDiscountCodeChange,
  Text,
  View,
  useDiscountAllocations,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";

export default reactExtension(
  "purchase.checkout.reductions.render-after",
  () => <Extension />
);

// working perfectly for manual discount not for automatic discount
function Extension() {
  const { query } = useApi();
  const cartItem = useCartLines();
  const discountCodeFunction = useApplyDiscountCodeChange();
  const discountcodeCart = useDiscountAllocations();
  const [tagfound, setTagFound] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const allCartLineDiscount = useMemo(
    () =>
      cartItem
        .map((item) => item.discountAllocations)
        .flat()
        .map((item) => (item.type === "code" ? item.code : item.title)),
    [cartItem]
  );

  const allCartDiscount = useMemo(
    () =>
      discountcodeCart.map((item) =>
        item.type === "code" ? item.code : item.title
      ),
    [discountcodeCart]
  );

  useEffect(() => {
    const productIds = cartItem.map((item) => item.merchandise.product.id);

    async function getProductTags() {
      const queryBody = `{
        nodes(ids: ${JSON.stringify(productIds)}) {
          ... on Product {
            tags
          }
        }
      }`;

      try {
        const { data } = await query(queryBody);
        const allTags = data.nodes.flatMap((item) => item.tags || []);
        const isTagFound = allTags.includes("block-discount");
        setTagFound(isTagFound);
      } catch (error) {
        console.error("Error fetching product tags:", error);
      }
    }

    getProductTags();
  }, [cartItem]);

  useEffect(() => {
    const allDiscountCode = [...allCartLineDiscount, ...allCartDiscount];

    if (tagfound && allDiscountCode.length) {
      allDiscountCode.forEach((item) =>
        discountCodeFunction({
          code: item,
          type: "removeDiscountCode",
        })
      );
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [tagfound, discountcodeCart, cartItem]);

  return (
    <>
      {showMessage && (
        <Text appearance="critical">You can not apply a discount code...</Text>
      )}
    </>
  );
}
