import {
  useApi,
  useTranslate,
  reactExtension,
  View,
  BlockStack,
  Heading,
  Text,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";
import TimerText from "./components/TimerText.jsx";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const setting = useSettings();
  const timerTextValues = {
    TIMER_WARNING_TEXT: translate("warningText", {
      target: extension.target,
    }),
    TIMER_SMALL_TEXT: "Your cart is reserved for :",
    COUNTDOWN_TIME: 5,
  };
  const { timer_warning_text, timer_small_text, countdown_time } = setting;
  console.log(countdown_time);
  const countdownTimeInSecond =
    (countdown_time ?? timerTextValues.COUNTDOWN_TIME) * 60;

  return (
    <BlockStack>
      <View
        border="base"
        padding="base"
        inlineAlignment="center"
        cornerRadius={"base"}
        background="subdued"
      >
        <Heading level="3" inlineAlignment="center">
          {timer_warning_text || timerTextValues.TIMER_WARNING_TEXT}
        </Heading>
      </View>
      <View inlineAlignment="center" background="base">
        <Text size="base" emphasis="bold">
          {timer_small_text || timerTextValues.TIMER_SMALL_TEXT}{" "}
          <TimerText timeProps={countdownTimeInSecond} />
        </Text>
      </View>
    </BlockStack>
  );
}
