import EraHome from "../components/home/EraHome"
import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <EraHome />
    </>
  )
}
