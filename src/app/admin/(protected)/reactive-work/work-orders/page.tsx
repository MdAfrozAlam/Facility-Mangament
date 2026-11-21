import { Wrench } from "lucide-react";

import AllWorkOrder from "@/app/components/all-work-order/AllWorkOrder";

const breadcrumbs = [
  {
    label: "Reactive Work",
    icon: <Wrench size={18} />,
  },
  {
    label: "All Work Orders",
  },
];

export default function ReactiveAllWorkOrderPage() {
  return <AllWorkOrder breadcrumbs={breadcrumbs} />;
}
