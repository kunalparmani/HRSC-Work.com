This document sums up general guidelines and tips on the usage of Design Tokens on Employee Workspace.

# Global Design Tokens

Global Design Tokens are tokens available for your Aura or LWC components that can be used directly from your CSS.

## Which token can I use ?

You can use tokens inherited from `force:base` or from **SLDS**

-   from `force:base` [see list here](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/tokens_standard_force_base.htm)
-   from SLDS, see available tokens on [**SLDS** documentation](https://www.lightningdesignsystem.com/design-tokens/) (⚠️ use only tokens flagged as **GA**)

    ![image](https://user-images.githubusercontent.com/12657050/98233227-04558600-1f5f-11eb-94c9-962abcda3a1c.png)

## How to use it in my Aura Components?

Use `token(<tokenName>)` in your Aura Component **CSS**.
⚠️ Important note: do not use `var(--c-...)` syntax on Aura components as it doesn't seem to be parsed on push or package creation.

## How to use it in my LWC Components?

Use `var(--lwc-<tokenName>)` in your **CSS**

# Custom Design Tokens

We use custom design tokens to reach two different goals right now :

-   be able to share sizing, spacing and colors between components (and prepare things for themability)
-   duplicate internal design tokens from LWC that are very common and useful (fontSizing for example)

## Declaration

declare your custom token in `defaultTokens.tokens`

```
<aura:tokens extends="forceCommunity:base">
    ...
    <aura:token name="<customTokenName>" value="#f3f2f2" />
    ...
</aura:tokens>
```

## How to use it in my Aura Components?

Use `token(<customTokenName>)` in your Aura component **CSS**.

```
   background-color: token(<customTokenName>);
```

## How to use it in my LWC Components?

Use `var(--c-<customTokenName>, var(--wkdw-<customTokenName>))` in your LWC component **CSS**.
