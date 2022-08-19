import {
  Container,
  Row,
  Text,
  Grid,
  Card,
  Button,
  Avatar,
  Spacer,
  Loading
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import {useApi} from "../../hooks/useApi";
import {useEther} from "../../hooks/useEther"
import {ApproveBtn} from "../../components/WagmiComponent"


export default function BackOffice() {
  const router = useRouter();
  const { address } = useAccount();
  const [profiles, setProfiles] = useState([]);
  const { getBountys } = useApi();
  const {getProposal} =useEther();
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);
  async function fetchProfiles() {
    setIsLoading(true)
    try {
      const response = await getBountys();
      let newData=[];
      for(let i=0; i<response.data.length ;i++ ){
        const id = response.data[i].task_id.split("-")[1]
        if(id){
          const {bounty,state} = await fetchProposal(id)
          if(state==1){
            newData.push({...response.data[i],bounty:bounty.toNumber(),state,id})
          }
        }
      }
      console.log(newData)
      setProfiles(newData);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false)
  }

  async function fetchProposal(id){
    const data = await getProposal(id); 
    return data
  }
  return (
    <Container sm>
      <Row align="baseline">
        <Text h5>Task List Waiting To Approve</Text>
      </Row>
      {isLoading ? <Row justify="center" css={{mt:"$20"}}><Loading type="gradient" size="xl"/></Row>:
      <Grid.Container gap={2} justify="center">
        {profiles.map((profile, index) => {
          const {
            task_id,
            id,
            description,
            title,
            _id,status,bounty
          } = profile;
          return (
            <Grid xs={6} key={index}>
              {/* <Link href={`/bounty/${projectId}`} key={index}> */}
              <Card
              >
                <Card.Header css={{ justifyContent: "space-between" }}>
                  <div>
                    <Text small b>
                      Time Duration: 7 Day
                    </Text>
                    <div>
                      <Text small color="secondary">
                        10 Auditor: 4 Standard, 6 HighLevel
                      </Text>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    css={{ paddingLeft: "0" }}
                    auto
                    icon={
                      <Avatar
                        css={{ margin: "0" }}
                        size="sm"
                        src={`https://i.pravatar.cc/150?u=${task_id}`}
                      />
                    }
                    bordered
                    rounded
                  >
                    {task_id}
                  </Button>
                </Card.Header>
                <Card.Body css={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Text h4>{title}</Text>
                  <Grid.Container>
                  <Grid xs={12}>
                    <Text>{description.link}</Text>
                  </Grid>
                  </Grid.Container>
                </Card.Body>
                {/* <Card.Divider></Card.Divider> */}
                <Card.Footer>
                  <Grid.Container>
                    <Grid xs={6} justify="center">
                      <ApproveBtn proposal={id}/>
                    </Grid>
                    <Grid xs={6} justify="center">
                      <Button size="xs" color="error">
                        Decline
                      </Button>
                    </Grid>
                  </Grid.Container>
                </Card.Footer>
              </Card>
              <Spacer y={1} />
            </Grid>
          );
        })}
      </Grid.Container>}
    </Container>
  );
}
