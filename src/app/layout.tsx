import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../ui/global.css";
import CombinedProvider from "./providers/CombinedProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: "Risk Visuals",
	description: "Tools for visualizing climate-related risk probabilities"
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.className}  antialiased`}>
				<CombinedProvider>
					<div className="flex-grow p-6 md:p-12">{children}</div>
				</CombinedProvider>
			</body>
		</html>
	);
}
