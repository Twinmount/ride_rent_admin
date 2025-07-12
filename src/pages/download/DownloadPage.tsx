import PageLayout from "@/components/common/PageLayout";
import { downloadSections } from "./download-sections.config";
import DownloadDialog from "@/components/dialog/DownloadDialog";

export default function DownloadPage() {
  return (
    <PageLayout heading="Manage Downloads">
      {downloadSections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          {section.triggers.map((trigger) => (
            <DownloadDialog
              key={trigger.triggerLabel}
              triggerLabel={trigger.triggerLabel}
              dialogTitle={trigger.dialogTitle}
            >
              <trigger.Component {...(trigger.props || {})} />
            </DownloadDialog>
          ))}
        </section>
      ))}
    </PageLayout>
  );
}
