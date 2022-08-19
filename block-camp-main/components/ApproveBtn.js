import { Button } from "@nextui-org/react"
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import ABI from "../assets/abi";

export default function ApproveBtn(){
    const { config } = usePrepareContractWrite({
        addressOrName: '0x84e67AF19b12201A12fd51b2c7897374539501cb',
        contractInterface: ABI,
        functionName: 'approve',
        args:16
      })
      const { writeAsync } = useContractWrite(config)
    return <Button size="xs" color="success" onPress={()=>{writeAsync?.()}}>
    Approve
  </Button>
}