import {
  Text,
  Container,
  Grid,
  Card,
  Col,
  Avatar,
  Textarea,
  Spacer,
  Row,
  Button,
  Progress,
} from "@nextui-org/react";
import {StartStandard,StartHighLevel} from "./WagmiComponent"

export default function AcceptCard(props) {
  const {isDisable} = props
  return (
    <Card variant="flat">
      <Grid.Container gap={2}>
        <Grid xs={12}>
          <Progress value={3} max={5} color="gradient" size="sm" />
          <Text small b css={{ ml: "$4", width: "fit-content" }}>
            3/5 To Start
          </Text>
        </Grid>
        <Grid xs={12}>
          <Col>
            <Text h6>Standard Auditor</Text>
            <StartStandard/>
          </Col>
        </Grid>
        <Grid xs={12}>
          <Col>
            <Text h6>HighLevel Auditor</Text>
<StartHighLevel/>
          </Col>
        </Grid>
      </Grid.Container>
    </Card>
  );
}
