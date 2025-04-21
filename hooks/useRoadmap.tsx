import { markComplete } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchRoadmap = async (roadmapId: string) => {
  const { data } = await axios.get("/api/roadmaps/steps?roadmapId=" + roadmapId);
  return data;
};

const useRoadmap = (roadmapId: string) => {
  const queryClient = useQueryClient();

  const {
    data: steps = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roadmap"],
    queryFn: () => fetchRoadmap(roadmapId),
    refetchOnWindowFocus: false,
  });

  const completeStepMutation = useMutation({
    mutationFn: async (roadmapId: string) => markComplete(roadmapId),
    mutationKey: ["completeStep"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });

  return { steps, isLoading, error, completeStepMutation };
};

export default useRoadmap;
