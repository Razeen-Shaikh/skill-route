import RoadmapTree from '@/components/roadmaps/RoadmapTree';
import React from 'react'

const RoadmapSteps = ({ params }: { params: { id: string } }) => {
  return <RoadmapTree roadmapId={params.id} />
}

export default RoadmapSteps