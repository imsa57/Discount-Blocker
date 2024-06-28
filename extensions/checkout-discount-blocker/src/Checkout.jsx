import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useCartLines,
  useDiscountCodes,
  useApplyDiscountCodeChange,
  Text,
  View,
  useApplyCartLinesChange,
  useDiscountAllocations,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const { query } = useApi();
  const cartItem = useCartLines();
  const discountCodeFunction = useApplyDiscountCodeChange();
  const [tagfound, setTagFound] = useState(false);
  const discountcodeCart = useDiscountAllocations();

  const allCartLineDiscount = useMemo(
    () =>
      cartItem
        .map((item) => item.discountAllocations)
        .flat()
        .map((item) => {
          if (item.type == "code") {
            return item.code;
          } else {
            return item.title;
          }
        }),
    [cartItem]
  );
  const allCartDiscount = useMemo(
    () =>
      discountcodeCart.map((item) => {
        if (item.type == "code") {
          return item.code;
        } else {
          return item.title;
        }
      }),
    [discountcodeCart]
  );
  useEffect(() => {
    const productIds = cartItem.map((item) => item.merchandise.product.id);
    const getProductTags = async () => {
      const queryBody = `{
        nodes(ids: ${JSON.stringify(productIds)}) {
          ... on Product {
            tags
          }
        }
      }`;

      const { data } = await query(queryBody);
      const allTags = data.nodes.map((item) => item.tags).flat();
      const isTagFound = allTags.some((item) => item === "block-discount");
      setTagFound(isTagFound);
    };
    getProductTags();
  }, []);

  useEffect(() => {
    if (tagfound) {
      const allDiscountCode = [...allCartLineDiscount, ...allCartDiscount];
      console.log(allDiscountCode);
      allDiscountCode.forEach((item) => {
        discountCodeFunction({
          code: item,
          type: "removeDiscountCode",
        });
      });
    }
  }, [tagfound]);

  return (
    <>
      {tagfound ? (
        <View padding={"tight"} inlineAlignment={"center"}>
          <Text appearance="critical">You can't apply discount code...</Text>
        </View>
      ) : null}
    </>
  );
}
