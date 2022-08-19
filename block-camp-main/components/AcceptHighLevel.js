import { Button } from "@nextui-org/react"
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import ABI from "../assets/abi";

export default function AcceptHighLevel(){
    const { config } = usePrepareContractWrite({
        addressOrName: '0x84e67AF19b12201A12fd51b2c7897374539501cb',
        contractInterface: ABI,
        functionName: 'acceptTask',
        args:[15,true]
      })
      const { writeAsync } = useContractWrite(config)
    return <Button
  disabled={false}
  onPress={()=>{writeAsync?.()}}
    size="sm"
    auto
    // icon={<span className="material-symbols-rounded">verified</span>}
    color="primary"
  > 
    Start
  </Button>
}

