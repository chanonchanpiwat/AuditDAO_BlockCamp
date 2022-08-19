import { Container, Card, Text, Grid } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Footer() {
  return (
    <Card.Footer
      isBlurred
      css={{
        position: "sticky",
        bgBlur: "#ffffff66", //isDark ? "#0f111466" : "#ffffff66",
        borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Container sm>
        <Grid.Container>
          <Grid xs={3}>
            <Text small b>
              Reply
            </Text>
          </Grid>
          <Grid xs={3}>
            <Text small b>
              Reply
            </Text>
          </Grid>
          <Grid xs={6}>
            <Text small b>
              Reply
            </Text>
          </Grid>
        </Grid.Container>
      </Container>
    </Card.Footer>
  );
}
