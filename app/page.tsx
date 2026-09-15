import { ExplorerApp } from "@/components/explorer/explorer-app";
import { getExplorerPayload, getIssueDetail, getScholarDetail } from "@/lib/data/explorer";

export default function HomePage() {
  const explorer = getExplorerPayload();
  const firstIssue = explorer.issues[0];
  const issueDetail = getIssueDetail(firstIssue.id);
  const initialScholar = getScholarDetail(issueDetail.paths[0].scholars[0].id);

  return <ExplorerApp explorer={explorer} initialIssue={issueDetail} initialScholar={initialScholar} />;
}
