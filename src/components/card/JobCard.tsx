import { JobFormType } from "@/types/types";
import { Link } from "react-router-dom";

type JobCardProps = {
  job: JobFormType;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="group mx-auto h-full w-full min-w-[265px] max-w-full transform overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      <Link
        to={`/careers/jobs/edit/${job?._id}`}
        className="flex h-full flex-col justify-between"
      >
        <div className="h-48 p-4">
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold">
            {job?.jobtitle}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {job?.jobdescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 p-4 text-sm text-gray-600">
          <span className="rounded-md bg-slate-100 px-2 text-yellow shadow-md">
            {job.location}
          </span>
          <span className="rounded-md bg-slate-100 px-2 text-yellow shadow-md">
            {job.level}
          </span>
          <span className="rounded-md bg-slate-100 px-2 text-yellow shadow-md">
            {job.experience}
          </span>
        </div>
      </Link>
    </div>
  );
}
