const tiers = [
  {
    name: "Starter",
    id: "0",
    href: "#",
    priceMonthly: null,
    description: "Get chatting right away with anyone, anywhere!",
    features: [
      "Unlimited Message Chat limit in Chats",
      "2 Participant limit in Chat",
      "3 Chat Rooms limit",
      "Supports 2 languages",
      "48-hour support response time",
    ],
  },
  {
    name: "Pro",
    id: "subIdFromStripe",
    href: "#",
    priceMonthly: "₹500",
    description: "Unlock the Full Potential with Pro!",
    features: [
      "Unlimited Messages in Chats",
      "Unlimited Participant in Chat",
      "Unlimitied Chat Rooms",
      "Supports up to 10 languages",
      "Multimedia Support (coming soon)",
      "1-hour, dedicated support response time",
      "Early access to new features",
    ],
  },
];

type Props = { redirect: boolean };

const PricingCards = ({ redirect }: Props) => {
  return <div className=""></div>;
};

export default PricingCards;
