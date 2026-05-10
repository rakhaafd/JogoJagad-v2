import { verificationQueue } from "../../services/mock-data";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  ResponsiveTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "../../components/ui/table";

export function VerificationTable() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Preventive Action Verification</h3>
      <ResponsiveTable>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Region</TableHeaderCell>
              <TableHeaderCell>Points</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {verificationQueue.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell>{item.points}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      item.status === "approved"
                        ? "safe"
                        : item.status === "rejected"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ResponsiveTable>
    </Card>
  );
}
