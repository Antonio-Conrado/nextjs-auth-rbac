import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/shared/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";

type Props = {
  links: { href: string; name: string }[];
};

export default function BeadCrumbNav({ links }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => (
          <BreadcrumbItem key={link.name}>
            <BreadcrumbLink href={link.href} className="capitalize">
              {link.name}
            </BreadcrumbLink>
            {index < links.length - 1 && <SlashIcon className="size-3" />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
