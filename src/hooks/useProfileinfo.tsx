import { userProfile } from "@/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export const useProfileInfoHook = ()=>{
      const { data, isLoading } = useQuery({
        queryKey: ['fetchUserProfile'],
        queryFn: async () => {
            return await userProfile();
        },
    });
    return  {data, isLoading};
}

