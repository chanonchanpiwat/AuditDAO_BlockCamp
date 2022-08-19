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
import {useApi} from "../hooks/useApi";
import { useEther } from "../hooks/useEther";
import * as dayjs from 'dayjs'

export default function Home() {
  const router = useRouter();
  const { getBountys } = useApi();
  const [profiles, setProfiles] = useState([]);
  const {getProposal,getProposalAuditor} =useEther();
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  },[]);
  async function fetchProfiles() {
    setIsLoading(true)
    try {
      const response = await getBountys();
      let newData=[];
      for(let i=0; i<response.data.length ;i++ ){
        const id = response.data[i].task_id.split("-")[1]
        if(id){
          const {bounty,state} = await fetchProposal(id)
          const {highAuditors,midAuditors,midAuditMax,highAuditMax} = await getProposalAuditor(id)
          if(state==2){
            newData.push({...response.data[i],bounty:bounty.toNumber(),state,auditor:{highAuditors,midAuditors,highAuditMax,midAuditMax}})
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
      <Text h5>Select your project your want to participate</Text>
    </Row>
    {isLoading ? <Row justify="center" css={{mt:"$20"}}><Loading type="gradient" size="xl"/></Row>:<Grid.Container gap={2} justify="center">
      {profiles.map( (profile, index) => {
        const {
          task_id,
          description,
          title,
          _id,status,bounty,auditor
        } = profile;
        return (
          <Grid xs={6} key={index}>
            {/* <Link href={`/bounty/${projectId}`} key={index}> */}
            <Card
              isPressable
              onPress={() => {
                router.push(`/bounty/${task_id}`);
              }}
            >
              <Card.Header css={{ justifyContent: "space-between" }}>
                <div>
                  <Text small b>
                    14 days left
                  </Text>
                  <div>
                    <Text small color="secondary">
                      {"    "}{`${auditor.highAuditors.length +auditor.midAuditors.length }`}/{`${auditor.midAuditMax.toNumber() + auditor.highAuditMax.toNumber()}`} Auditor To Start
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
                  <Grid xs={9}>
                    <Button size="xs" auto color="warning">
                      +20 xp
                    </Button>
                  </Grid>
                  <Grid xs={3} direction="column" justify="flex-end">
                    <Button size="xs" auto color="gradient">
                      {`${bounty} DAI`}
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
