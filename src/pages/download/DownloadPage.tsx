import PageLayout from "@/components/common/PageLayout";
import { downloadSections } from "./download-sections.config";
import DownloadDialog from "@/components/dialog/DownloadDialog";

export default function DownloadPage() {
  return (
    <PageLayout heading="Manage Downloads">
      {downloadSections.map((section) => (
        <section
          key={section.title}
          className="mb-8 w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="mb-6 border-b pb-4 text-2xl font-bold text-gray-800">
            {section.title}
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {section.triggers.map((trigger) => (
              <DownloadDialog
                key={trigger.triggerLabel}
                triggerLabel={trigger.triggerLabel}
                dialogTitle={trigger.dialogTitle}
              >
                <trigger.Component {...(trigger.props || {})} />
              </DownloadDialog>
            ))}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
