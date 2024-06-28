import {
  useApi,
  useTranslate,
  reactExtension,
  BlockStack,
  Heading,
  InlineLayout,
  Image,
  Button,
  ProductThumbnail,
  Text,
  useCartLines,
  useDiscountCodes,
} from "@shopify/ui-extensions-react/checkout";
import ProductDetails from "./components/ProductDetails.jsx";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension, query } = useApi();
  const cartItem = useCartLines();
  // const productId = cartItem.map((lineItem) => lineItem.merchandise.product.id);
  // console.log(productId);
  // const { data } = query(`

  //   `);
  return (
    <BlockStack
      // inlineAlignment="center"
      border="base"
      borderRadius="base"
      padding="base"
      cornerRadius="large"
    >
      <Heading level="2" inlineAlignment="center">
        Customers Also Purchased
      </Heading>
      <InlineLayout
        blockAlignment="center"
        spacing="loose"
        columns={[70, "fill", "auto"]}
      >
        <ProductThumbnail
          source="https://photomarketingwizard.com/wp-content/uploads/2018/02/ecommerce-product-photography-25.jpg"
          border="base"
          aspectRatio={1}
          borderRadius="base"
        />
        <BlockStack>
          <Text size="base" emphasis="bold">
            Footwear Wipes
          </Text>
          <Text>$15.00</Text>
        </BlockStack>

        <Button
          kind="secondary"
          appearance="monochrome"
          inlineAlignment="end"
          overlay={<ProductDetails />}
        >
          Add
        </Button>
      </InlineLayout>
    </BlockStack>
  );
}
