import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  ArrowRightSolid, ArrowLeftSolid, ArrowAngularTopRightSolid, CheckCircle1Solid,
  MenuHamburger1Solid, XmarkSolid, Cart1Solid, ChatBubble2Solid, Share1Solid,
  Shield2Solid, Shield2CheckSolid, Telephone1Solid, Telephone3Solid, PhoneSolid,
  User4Solid, UserMultiple4Solid, Locked1Solid, Locked2Solid, MapPin5Solid,
  Alarm1Solid, Calculator1Solid, TargetUserSolid, Rocket5Solid, Cloud2Solid, Gears3Solid, Gear1Solid,
  Layout9Solid, Database2Solid, RefreshCircle1ClockwiseSolid, BarChart4Solid,
  Books2Solid, Microphone1Solid, FileMultipleSolid, Headphone1Solid, StarFatSolid,
  ArrowUpwardSolid, Code1Solid, MonitorCodeSolid, Megaphone1Solid,
  CreditCardMultipleSolid, TruckDelivery1Solid, Buildings1Solid, Home2Solid,
  AgendaSolid, PieChart2Solid, SpellcheckSolid, HandMicSolid, LaptopPhoneSolid,
  Notebook1Solid,
  type IconData,
} from "@lineiconshq/free-icons";

const registry: Record<string, IconData> = {
  ArrowRightSolid, ArrowLeftSolid, ArrowAngularTopRightSolid, CheckCircle1Solid,
  MenuHamburger1Solid, XmarkSolid, Cart1Solid, ChatBubble2Solid, Share1Solid,
  Shield2Solid, Shield2CheckSolid, Telephone1Solid, Telephone3Solid, PhoneSolid,
  User4Solid, UserMultiple4Solid, Locked1Solid, Locked2Solid, MapPin5Solid,
  Alarm1Solid, Calculator1Solid, TargetUserSolid, Rocket5Solid, Cloud2Solid, Gears3Solid, Gear1Solid,
  Layout9Solid, Database2Solid, RefreshCircle1ClockwiseSolid, BarChart4Solid,
  Books2Solid, Microphone1Solid, FileMultipleSolid, Headphone1Solid, StarFatSolid,
  ArrowUpwardSolid, Code1Solid, MonitorCodeSolid, Megaphone1Solid,
  CreditCardMultipleSolid, TruckDelivery1Solid, Buildings1Solid, Home2Solid,
  AgendaSolid, PieChart2Solid, SpellcheckSolid, HandMicSolid, LaptopPhoneSolid,
  Notebook1Solid,
};

export function Icon({
  icon,
  size = 18,
  className,
}: {
  icon: IconData | string;
  size?: number | string;
  className?: string;
}) {
  const data = typeof icon === "string" ? registry[icon] : icon;
  if (!data) {
    if (process.env.NODE_ENV === "development") throw new Error(`Unknown icon: ${icon}`);
    return null;
  }
  return <Lineicons icon={data} size={size} className={className} aria-hidden="true" />;
}

export function IconBox({ icon, size = 20 }: { icon: IconData | string; size?: number }) {
  return (
    <span className="icn">
      <Icon icon={icon} size={size} />
    </span>
  );
}
