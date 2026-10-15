import { Chip, type ChipTone } from "@/components/ui/chip";
import { Table, Th } from "@/components/ui/table";
import { formatRange, formatValue, statusOf, type LabTest, type ParameterStatus } from "./data";

const chipTone: Record<ParameterStatus, ChipTone> = { Normal: "success", High: "warning", Low: "danger" };

/** Every parameter of the test with its reference range. */
export function TestResults({ test }: { test: LabTest }) {
  return (
    <Table variant="simple" minWidth={480} aria-label={`${test.name} results`}>
      <thead>
        <tr>
          <Th scope="col">Parameter</Th>
          <Th scope="col">Result</Th>
          <Th scope="col">Reference range</Th>
          <Th scope="col">Status</Th>
        </tr>
      </thead>
      <tbody>
        {test.parameters.map((parameter) => {
          const status = statusOf(parameter);
          return (
            <tr key={parameter.name}>
              <th scope="row" className="text-label">
                {parameter.name}
              </th>
              <td className="num">
                <span className="text-label">{formatValue(parameter)}</span> <span className="text-small text-muted">{parameter.unit}</span>
              </td>
              <td className="text-small text-muted num">
                {formatRange(parameter)} {parameter.unit}
              </td>
              <td>
                <Chip tone={chipTone[status]} variant="tag" size="sm">
                  {status}
                </Chip>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
