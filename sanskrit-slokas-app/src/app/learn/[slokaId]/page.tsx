import React, { Suspense } from 'react';
import SlokaLearner from '@/components/SlokaLearner';

const SlokaLearnerPage = ({ params }: { params: { slokaId: string } }) => {
  return (
    <div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <SlokaLearner slokaId={params.slokaId} />
      </Suspense>
    </div>
  );
};

export default SlokaLearnerPage; 