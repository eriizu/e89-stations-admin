import * as context from "./components/context";

// this deducts the type of our load list, and will be cleared.

export let loadList = [
    {
        getMiddlewares: context.middlewares.getGlobal || undefined,
        useRouter: context.useRouter || undefined,
    },
];

import * as components from "./components";

loadList.pop();
for (let comp in components) {
    console.log("adding component to load list: ", comp);
    loadList.push({
        getMiddlewares: components[comp]?.middlewares?.getGlobal,
        useRouter: components[comp]?.useRouter || components[comp]?.router?.useRouter,
    });
}

export default loadList;
