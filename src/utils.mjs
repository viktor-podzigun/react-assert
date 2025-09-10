import TestRenderer from "react-test-renderer";

/**
 * @template T
 * @param {() => T} callback
 * @returns {Promise<T>}
 */
export async function actAsync(callback) {
  /** @type {T} */
  let result;

  await TestRenderer.act(async () => {
    result = callback();
  });

  //@ts-ignore
  return result;
}
