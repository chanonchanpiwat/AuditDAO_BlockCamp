import { Button } from "@nextui-org/react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import ABI from "../assets/abi";

const contractAddress = "0x84e67AF19b12201A12fd51b2c7897374539501cb";

export function StartHighLevel(id) {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: ABI,
    functionName: "acceptTask",
    args: [22, true],
    onError(error) {
        console.log('Error', error)
      },
  });
  const { write } = useContractWrite(config);
  return (
    <Button
      disabled={false}
      onPress={() => {
        write?.();
      }}
      size="sm"
      auto
      // icon={<span className="material-symbols-rounded">verified</span>}
      color="primary"
    >
      Start
    </Button>
  );
}

export function StartStandard(id) {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: ABI,
    functionName: "acceptTask",
    args: [22, false],
    onError(error) {
        console.log('Error', error)
      },
  });
  const { write } = useContractWrite(config);
  return (
    <Button
      onPress={() => {
        write?.();
      }}
      disabled={false}
      size="sm"
      auto
      color="secondary"
    >
      Start
    </Button>
  );
}

export function ApproveBtn(props) {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: ABI,
    functionName: "approve",
    args: props.proposal,
    onError(error) {
        console.log('Error', error)
      },
  });
  const { write} = useContractWrite(config);
  return (
    <Button
      size="xs"
      color="success"
      onPress={() => {
        write?.();
      }}
    >
      Approve
    </Button>
  );
}
