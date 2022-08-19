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
  Loading,
} from "@nextui-org/react";
import TaskCard from "../../components/TaskCard";
import AcceptCard from "../../components/AcceptCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useApi } from "../../hooks/useApi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEther } from "../../hooks/useEther";
import parse from 'html-react-parser';

function Bounty() {
  const router = useRouter();
  const { id } = router.query;
  const [bounty, setBounty] = useState();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const { getBounty,getComment,addComment } = useApi();
  const [onComment,setOnComment] = useState(false)
  const { address, isConnected } = useAccount();
  const {getBalance} = useEther()
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      try {
        const response = await getBounty(id);
        const responseComment = await getComment(id);
        setBounty(response.data[0]);
        setComments(responseComment.data);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false)
    }
    if (id) {
      fetchProfile();
    }
  },[id,onComment]);

  useEffect(()=>{
    setShowWhitelist(address == "0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44")
  },[address])

  return (
    <Container sm>
      {isLoading ? <Row justify="center" css={{mt:"$20"}}><Loading type="gradient" size="xl"/></Row>:<Grid.Container gap={2} justify="center">
        <Card>
          <Grid.Container gap={1} justify="center">
            <Grid xs={9}>
              <TaskCard
                head={bounty ? bounty.title : ""}
                text={ bounty ? bounty.description.text: ""}
                link={ bounty ? bounty.description.link: ""}
                task_id={id}
                isLock={showWhitelist}
              />
            </Grid>
            <Grid xs={3}>
              <AcceptCard isDisable={false}/>
            </Grid>
          </Grid.Container>
        </Card>
        <Spacer y={0.5} />
        <Grid xs={12}>
          <Text h5>{`${comments.length} Participant`}</Text>
        </Grid>

        <>
          {comments.map((comment, index) => {
            const { user_addr, comment:text, sub_comment } = comment;
            return (
              <Grid key={index} xs={12}>
                <div></div>
                <Card>
                  <Card.Body css={{ p: "$6" }}>
                    <Textarea bordered readOnly initialValue={text} />
                  </Card.Body>
                  <Card.Footer>
                    <Grid.Container>
                      <Grid xs={12}>
                        <Avatar
                          css={{ mr: "$6" }}
                          size="md"
                          src={`https://i.pravatar.cc/150?u=${user_addr}`}
                          color="gradient"
                          bordered
                        />
                        <Col>
                          <Text h6>{user_addr}</Text>
                          <>
                            <span className="material-symbols-rounded">
                              workspace_premium
                            </span>
                            <span className="material-symbols-rounded">
                              military_tech
                            </span>
                            <span className="material-symbols-rounded">
                              verified
                            </span>
                            <span className="material-symbols-rounded">
                              token
                            </span>
                          </>
                        </Col>
                      </Grid>

                      <Grid.Container>
                        <Button light auto size="sm">
                          <Text small b>
                            Reply
                          </Text>
                        </Button>
                        {sub_comment
                          ? sub_comment.map((reply, index) => {
                            const {sub_comment,user_addr} = reply;
                              return (
                                <Grid xs={12} key={index}>
                                  <Col>
                                    <Card.Divider></Card.Divider>
                                    <Text small css={{ pl: "$8" }}>
                                      {sub_comment}
                                    </Text>
                                    <Text
                                      small
                                      color="primary"
                                    >{` - ${user_addr}`}</Text>
                                  </Col>
                                </Grid>
                              );
                            })
                          : () => {}}
                      </Grid.Container>
                    </Grid.Container>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        </>
        <Grid xs={12}>
          <Card>
            <Card.Body css={{ p: "$6" }} id="comment-section">
              <Text h5>Write your answer</Text>
              <div>
                <Textarea
                  minRows={6}
                  fullWidth
                  css={{ my: "$6" }}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                />
                <Row>
                  <Button
                    ghost
                    color="primary"
                    auto
                    onPress={ async () => {
                      await addComment(id,commentText,address)
                      setOnComment(!onComment)
                    }}
                  >
                    submit
                  </Button>
                </Row>
                <div id="comment">
                  {showWhitelist ? (
                    <div></div>
                  ) : (
                    <Card.Footer
                      css={{
                        bgBlur: "#ffffff66",
                        position: "absolute",
                        borderRadius: "0",
                        height: "100%",
                        zIndex: 500,
                        top: 0,
                        left: 0,
                        justifyContent:"center"
                      }}
                      isBlurred
                    >
                      <ConnectButton label="Connect Wallet To Participate" />
                    </Card.Footer>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>}
      
    </Container>
  );
}

export default Bounty;
