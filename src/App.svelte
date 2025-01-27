<script lang="ts">
    import clamSvg from './assets/clam-svgrepo-com.svg'
    import shrimpSvg from './assets/prawn-svgrepo-com.svg'
    import anchovySvg from './assets/anchovy-svgrepo-com.svg'
    import octopusSvg from './assets/octopus-svgrepo-com.svg'
    import crabSvg from './assets/crab-svgrepo-com.svg'
    import tunaSvg from './assets/tuna-svgrepo-com.svg'
    import monetize from './lib/monetize';
    import { localStorageState } from './lib/storageState.svelte';

    type ProductName = 'Clam' | 'Shrimp' | 'Anchovy' | 'Octopus' | 'Crab' | 'Tuna'

    interface ProductDependency {
        name: ProductName,
        dependencyQuantity: number
    }

    interface Product {
        name: ProductName
        svg: string

        produceQuantity: number
        produceQuantityMultiplier: number
        produceTime: number

        dependencies?: ProductDependency[]
    }
    
    let products = localStorageState<Product[]>('catculator:products', [
        { 
            name: 'Clam', 
            svg: clamSvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0
        },
        { 
            name: 'Shrimp', 
            svg: shrimpSvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0
        },
        { 
            name: 'Anchovy', 
            svg: anchovySvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0,
            dependencies: [
                { name: 'Clam', dependencyQuantity: 0 }
            ]
        },
        { 
            name: 'Octopus', 
            svg: octopusSvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0,
            dependencies: [
                { name: 'Shrimp', dependencyQuantity: 0 }
            ]
        },
        { 
            name: 'Crab', 
            svg: crabSvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0 
        },
        { 
            name: 'Tuna', 
            svg: tunaSvg,
            produceQuantity: 0, 
            produceQuantityMultiplier: 1,
            produceTime: 0,
            dependencies: [
                { name: 'Crab', dependencyQuantity: 0 }
            ]
        },
    ])

    const inventory = $derived.by(() => {
        const inventory = products.value.reduce((prev, curr) => {
            prev[curr.name] = 0

            return prev
        }, {} as Record<ProductName, number>)

        // Inventarios positivos
        for(const product of products.value) {
            if (product.produceTime > 0) {
                inventory[product.name] += 20 * (product.produceQuantity * product.produceQuantityMultiplier) / product.produceTime
                
                if (product.dependencies) {
                    for(const dependency of product.dependencies) {
                        inventory[dependency.name] -= 20 * dependency.dependencyQuantity / product.produceTime
                    }
                }
            }
        }

        return inventory
    })
</script>

<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each products.value as product (product.name)}      
        {@const productInventory = inventory[product.name]}
        <div class="card card-border bg-base-200">
            <div class="card-body">
                <h2 class="card-title">
                    <img
                        src={product.svg}
                        alt={product.name}

                        width={48}
                        height={48}
                    />
                    {product.name}
                </h2>
                <div class="grid grid-cols-2 gap-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">
                            Produced Quantity
                        </legend>
                        <div class="join">
                            <input 
                                type="number" 
                                min="0" 
                                class="input join-item" 
                                placeholder="0" 
                                bind:value={product.produceQuantity}
                            />
                            <select class="select join-item" bind:value={product.produceQuantityMultiplier}>
                                <option value={1}></option>
                                <option value={1_000}>k</option>
                                <option value={1_000_000}>m</option>
                            </select>
                        </div>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">
                            Production Time (s)
                        </legend>
                        <input 
                            type="number" 
                            min="0" 
                            class="input" 
                            placeholder="0" 
                            bind:value={product.produceTime}
                        >
                    </fieldset>
                </div>
                {#if product.dependencies}
                    <div>Required Resources</div>
                    {#each product.dependencies as dependency}
                        {@const dependencyProduct = products.value.find(p => p.name === dependency.name)}
                        {#if dependencyProduct}
                            <div class="flex gap-2">
                                <img
                                    src={dependencyProduct.svg}
                                    alt={dependencyProduct.name}
    
                                    width={24}
                                    height={24}
                                />
                                <input 
                                    type="number" 
                                    min="0" 
                                    class="input" 
                                    placeholder="0" 
                                    bind:value={dependency.dependencyQuantity}
                                />
                            </div>
                        {/if}
                    {/each}
                {/if}
                
                <div>Final Inventory:</div>
                {#if productInventory > 0}
                    <div class="text-success flex gap-2 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clip-rule="evenodd" />
                        </svg>
                        {monetize(productInventory)}
                    </div>
                {:else if productInventory === 0}
                    <div class="text-warning flex gap-2 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                        </svg>  
                        {monetize(productInventory)}
                    </div>
                {:else}
                    <div class="text-error flex gap-2 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z" clip-rule="evenodd" />
                        </svg>
                        {monetize(productInventory)}
                    </div>
                {/if}
                
            </div>
        </div>
    {/each}
</div>