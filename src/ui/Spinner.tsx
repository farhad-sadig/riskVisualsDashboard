import { Spinner as Sp } from "@nextui-org/react";

export default function Spinner() {
	return (
		<div className="flex justify-center items-center">
			<Sp size="lg" label="Loading Data" color="primary" labelColor="primary" />
		</div>
	);
}
