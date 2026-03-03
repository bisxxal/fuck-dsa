import { singleWritter } from "@/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export const useSingleWriterHook = ({id,type}:{id:string,type:'E'|'W'})=>{
      const { data, isLoading } = useQuery({
          queryKey: ['singleWritter', id],
          queryFn: async () => {
            return await singleWritter(id , type);
          },
        });
    return  {data, isLoading};
}