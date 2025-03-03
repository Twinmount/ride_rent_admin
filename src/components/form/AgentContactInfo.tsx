import React from "react";
import { ShieldCheck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AgentContactInfoProps {
  agentId?: string;
  email?: string;
  phoneNumber?: string;
}

interface ContactDetailProps {
  label: string;
  value: string;
  onCopy: (text: string, label: string) => void;
  type?: "text" | "email" | "phone";
}

/*
 agent contact info for displaying in CompanyForm
*/
export const AgentContactInfo: React.FC<AgentContactInfoProps> = ({
  agentId,
  email,
  phoneNumber,
}) => {
  const handleCopy = (value: string, label: string) => {
    // Add '+' if copying a phone number
    const textToCopy = label === "Phone Number" ? `+${value}` : value;

    navigator.clipboard.writeText(textToCopy || "");
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
      className: "bg-green-500 text-white",
    });
  };

  return (
    <>
      {agentId && (
        <ContactDetail
          label="Your Agent ID"
          value={agentId}
          onCopy={handleCopy}
        />
      )}
      {email && (
        <ContactDetail
          label="Email"
          value={email}
          onCopy={handleCopy}
          type="email"
        />
      )}
      {phoneNumber && (
        <ContactDetail
          label="Phone Number"
          value={phoneNumber}
          onCopy={handleCopy}
          type="phone"
        />
      )}
    </>
  );
};

// individual contact detail
const ContactDetail: React.FC<ContactDetailProps> = ({
  label,
  value,
  onCopy,
  type = "text",
}) => {
  const getHref = () => {
    if (type === "email") return `mailto:${value}`;
    if (type === "phone") return `tel:+${value}`;
    return undefined;
  };

  return (
    <div className="mb-2 flex w-full max-sm:flex-col">
      <div className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
        {label} <span className="mr-5 max-sm:hidden">:</span>
      </div>
      <div className="mt-4 flex w-full cursor-pointer items-center text-lg font-semibold text-gray-500">
        {type === "text" ? (
          <span className="cursor-default">{value}</span>
        ) : (
          <a
            href={getHref()}
            className="underline hover:text-blue-600"
            title={`Open ${label}`}
          >
            {type === "phone" ? `+${value}` : value}
          </a>
        )}
        <ShieldCheck className="ml-3 text-green-500" size={20} />
        <Button
          type="button"
          onClick={() => onCopy(value, label)}
          className="ml-8 h-fit bg-slate-600 p-1 text-gray-500 hover:bg-slate-900 hover:shadow-md"
        >
          <Copy className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};
