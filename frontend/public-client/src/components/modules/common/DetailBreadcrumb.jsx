import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
export function DetailBreadcrumb({ data }) {
  return (
    <Breadcrumb size="sm">
      <BreadcrumbList>
        {data.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link to={item?.link}>{item?.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < data.length - 1 && (
              <BreadcrumbSeparator></BreadcrumbSeparator>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
