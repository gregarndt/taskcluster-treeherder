import taskcluster from 'taskcluster-client';

export default async function(queue, taskId, runId, job) {
  let res;
  try {
    res = await queue.listArtifacts(taskId, runId);
  } catch(e) {
    console.log(`Error fetching artifacts for ${taskId}, ${e.message}`);
    return job;
  }

  let artifacts = res.artifacts;

  while (res.continuationToken) {
    let continuation = {continuationToken: res.continuationToken};

    try {
      res = await queue.listArtifacts(taskId, runId, continuation);
    } catch(e) {
      console.log(`Error fetching artifacts for ${taskId}, ${e.message}`);
      break;
    }

    artifacts.extend(res.artifacts);
  }

  job.jobInfo.links.extend(
    artifacts.map((artifact) => {
      return {
        label: 'uploaded artifact',
        linkText: artifact.name,
        url: queue.buildUrl(queue.getArtifact, taskId, runId, artifact.name)
      };
    })
  );

  return job;
}
