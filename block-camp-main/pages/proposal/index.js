import {
  Card, Container, Grid, Input, Row, Button, Text, Textarea
} from "@nextui-org/react";
import {useState,useEffect} from "react";
import { useApi } from "../../hooks/useApi";
import { ethers } from "ethers";
import ABI from "../../assets/abi.json";
import * as dayjs from 'dayjs'
import { usePrepareContractWrite, useContractWrite,useContractEvent } from 'wagmi'

export default function Proposal() {
  const [form,setForm] =useState()
  const [onChain,setOnChain] = useState({_period:0,_amount:0,_highAuditMax:0,_midAuditMax:0})
  const {postPoposal} = useApi();

  const { config } = usePrepareContractWrite({
    addressOrName: '0x84e67AF19b12201A12fd51b2c7897374539501cb',
    contractInterface: ABI,
    functionName: 'propose',
    args:[onChain._period,onChain._amount,onChain._highAuditMax,onChain._midAuditMax]
  })
  useContractEvent({
    addressOrName: '0x84e67AF19b12201A12fd51b2c7897374539501cb',
    contractInterface: ABI,
    eventName: 'Propose',
    listener: async (event) => {
      await postPoposal({...form,task_id:`${form.task_id}-${event[1].toNumber()}`});
    },
  })

  const { writeAsync } = useContractWrite(config)

  return (
    <Container sm>
      
      <Row align="baseline">
        <Text h5>Form</Text>
      </Row>
      <Card css={{my:"$6"}}>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12}>
          <Input
          css={{width:"70%"}}
          clearable
          color="primary"
          helperText="Excelent Project Name"
          label="Project Name"
          placeholder="Enter Your Project Name"
          onChange={(e)=>{setForm({...form,task_id:e.target.value})}}
        />

          </Grid>
          <Grid xs={12}>
            <Textarea
              width="70%"
          color="primary"
              label="Title"
          helperText="Enter a larger title description"
              
              placeholder="Enter Your Title Description"
          onChange={(e)=>{setForm({...form,title:e.target.value})}}
            />
          </Grid>
          <Grid xs={12}>
          <Textarea
              minRows={5}

              width="70%"
          color="primary"
              label="Code"
              
          placeholder="Enter Your Description"
          onChange={(e)=>{setForm({...form,text:e.target.value})}}

          />
          </Grid>
          <Grid xs={12}>
          <Input
          css={{width:"70%"}}
          clearable
          color="primary"
          label="Link"
          placeholder="Enter Project Code Link"
          onChange={(e)=>{setForm({...form,link:e.target.value})}}

        />
          </Grid>
          <Grid xs={12}>
            <Input
            css={{mr:"$12"}}
              label="End of Proposal"
              type="date"
              color="primary"
          placeholder="Day/Month/Year"
          onChange={(e)=>{setOnChain({...onChain,_period:dayjs(e.target.value).unix()})}}

            />
            <Input
          color="primary"
          type="number"
          label="Reward"
          placeholder="100 USDC"
          onChange={(e)=>{setOnChain({...onChain,_amount:parseInt(e.target.value)})}}
        />
          </Grid>
          <Grid xs={12} >
          <Input
            css={{mr:"$12"}}
            label="Standard Auditor"
              type="number"
              color="primary"
          placeholder="0"
          onChange={(e)=>{setOnChain({...onChain,_midAuditMax:parseInt(e.target.value)})}}
            />
            <Input
          color="secondary"
          type="number"
          label="HighLevel Auditor"
          placeholder="0"
          onChange={(e)=>{setOnChain({...onChain,_highAuditMax:parseInt(e.target.value)})}}
        />
            </Grid>
            <Button shadow color="gradient" auto css={{mb:"$6"}} onPress={async ()=>{
              try{
                await writeAsync?.()
              }catch(e){
                console.log(e)
              }
             
            }} >
          Submit
        </Button>
        </Grid.Container>
      </Card>
      
    </Container>
  );
}
