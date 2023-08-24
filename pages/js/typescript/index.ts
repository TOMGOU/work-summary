function transform1<T extends Record<string, any>> (
  iteratee: (node: T) => any,
  treeData: T[],
  childrenKey: keyof T = 'children',
) {
  return treeData.map((node) => {
    const result = iteratee(node);
    const children = result[childrenKey];

    if (Array.isArray(children)) {
      result[childrenKey] = transform1(iteratee, children, childrenKey);
    }

    return result;
  });
}

const transform2 = <T extends Record<string, string | number>>(
  iteratee: (node: T) => any,
  treeData: T[],
  childrenKey: keyof T = 'children',
) => {
  return treeData.map((node) => {
    const result = iteratee(node);
    const children = result[childrenKey];

    if (Array.isArray(children)) {
      result[childrenKey] = transform2(iteratee, children, childrenKey);
    }

    return result;
  });
}


type T0 = Exclude<"a" | "b" | "c", "a">

enum Color { Red = 'red', Green = 'green', Blue = 'blue' }
type T1 = Exclude<Color, Color.Red | Color.Green>
type T2 = Exclude<Color, [Color.Blue, Color.Green]>

const col1: Record<T1, string> = {
  'blue': '3',
  'red': '2',
}

const col2: Record<T2, string> = {
  'blue': '3',
  'red': '2',
  'green': '1',
}
