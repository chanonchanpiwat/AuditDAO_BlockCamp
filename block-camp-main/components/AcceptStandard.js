import { Button } from "@nextui-org/react"
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import ABI from "../assets/abi";

export default function AcceptStandard(){
    const { config } = usePrepareContractWrite({
        addressOrName: '0x84e67AF19b12201A12fd51b2c7897374539501cb',
        contractInterface: ABI,
        functionName: 'acceptTask',
        args:[15,false]
      })
      const { writeAsync } = useContractWrite(config)
    return <Button
    onPress={()=>{writeAsync?.()}}
    disabled={false}
      size="sm"
      auto
      color="secondary"
      // icon={<span className="material-symbols-rounded">verified</span>}
    >
      Start
    </Button>
}