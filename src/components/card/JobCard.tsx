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
        className="flex h-full flex-col"
      >
        <div className="h-48 p-4">
          <h3 className="mb-3 mt-2 line-clamp-2 text-lg font-semibold">
            {job?.jobtitle}
          </h3>
          <div className="flex flex-col flex-wrap gap-1 text-sm text-gray-600">
            <span className="text-black">Location: {job.location}</span>
            <span className="text-black">Level: {job.level}</span>
            <span className="text-black">Exp: {job.experience}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
