import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Grid,
  Row,
  Text,
  Link,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import parse from 'html-react-parser';

export default function TaskCard(props) {
  const { head, text, link , isLock, bounty,task_id } = props;
  const [comments, setComments] = useState([]);

  return (
    <Card variant="flat" css={{ background: "inherit" }}>
      <Card.Header css={{ zIndex: 2 }}>
        <Text h3>{head}</Text>
      </Card.Header>
      <Card.Body>
        <div style={{zIndex:"1000"}}>{parse(text)}</div>
        <div><Link
          icon
          color="primary"
          target="_blank"
          href="https://github.com/nextui-org/nextui"
        >
          {link}
          
        </Link>
        {isLock ? (
          <div></div>
        ) : (
          <Card.Footer
            css={{
              bgBlur: "#ffffff66",
              position: "absolute",
              borderRadius: "0",
              height: "100%",
              zIndex: 1,
              bottom: 0,
              justifyContent:"baseline"
            }}
            isBlurred
          > 
          </Card.Footer>
        )}
        </div>
        
      </Card.Body>
      <Card.Footer css={{ zIndex: 2 }}>
        <Grid.Container>
          <Grid xs={12}>
            <Row justify="space-between" align="baseline">
              <Button
                light
                color="primary"
                auto
                size="sm"
              >
                <Text small b>
                  <Link href="#comment-section">
                    Add Your Answer
                  </Link>
                </Text>
              </Button>
              <Row css={{ width: "fit-content" }}>
                <Avatar
                  size="md"
                  src={`https://i.pravatar.cc/150?u=${task_id}`}
                  color="gradient"
                  bordered
                  css={{ mr: "$6" }}
                />
                <Col css={{ width: "fit-content" }}>
                  <Text h4 css={{ lineHeight: "$xs" }}>
                    {bounty ? bounty.projectName : ""}
                  </Text>
                  <Text css={{ color: "$accents8" }}>
                    {bounty ? bounty.title : ""}
                  </Text>
                </Col>
              </Row>
            </Row>
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card>
  );
}
