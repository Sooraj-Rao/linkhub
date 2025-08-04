import { Skeleton } from "@/components/ui/skeleton";

export const LinkhubSkeleton = () => (
  <div className="space-y-8 p-6">
    <Skeleton className="h-8 w-1/3  rounded "></Skeleton>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        <div className="glass rounded-2xl p-6s space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12  rounded-full "></Skeleton>
              <div className="space-y-2">
                <Skeleton className="h-6 w-40  rounded "></Skeleton>
                <Skeleton className="h-4 w-60  rounded "></Skeleton>
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24  rounded "></Skeleton>
              <Skeleton className="h-8 w-24  rounded "></Skeleton>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl pt-16 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32  rounded "></Skeleton>
            <Skeleton className="h-8 w-24  rounded "></Skeleton>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="flex items-center h-20 p-4 "
              ></Skeleton>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-8 rounded-md overflow-hidden">
        <div className="glass rounded-2xl p-6 space-y-4">
          <Skeleton className="w-full h-32  rounded "></Skeleton>
          <Skeleton className="h-6 w-40 mx-auto  rounded "></Skeleton>
          <Skeleton className="h-4 w-64 mx-auto  rounded "></Skeleton>
          <div className="space-y-2">
            {[...Array(2)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-10 w-full  rounded "
              ></Skeleton>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
