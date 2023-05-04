import { either, pipe } from 'ramda';
import externalToFn from './external-to-fn';
import getModulesMatcher from './get-modules-matcher';
import getDeps from './get-deps';

export default function PeerDepsExternalPlugin({
  packageJsonPath,
  includeDependencies,
} = {}) {
  return {
    name: 'peer-deps-external',
    options: opts => {
      opts.external = either(
        // Retain existing `external` config
        externalToFn(opts.external),
        // Add `peerDependencies` to `external` config
        getModulesMatcher(
          getDeps(packageJsonPath, 'peerDependencies').concat(
            includeDependencies ? getDeps(packageJsonPath, 'dependencies') : []
          )
        )
      );

      return opts;
    },
  };
}
