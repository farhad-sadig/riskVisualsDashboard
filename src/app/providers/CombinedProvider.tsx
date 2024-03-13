import React from "react";
import UIProvider from "./UIProvider";
import StoreProvider from "./StoreProvider";

const CombinedProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<StoreProvider>
		<UIProvider>{children}</UIProvider>
		</StoreProvider>
	);
};

export default CombinedProvider;
