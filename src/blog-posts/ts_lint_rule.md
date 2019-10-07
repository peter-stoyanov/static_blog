TS lint custom ban rule
======================

TS linter allows for the creation of custom rules.

One such example is a rule which traverses the source code and looks for a value which is not allowed - in this case the word 'only'

```typescript
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Use of only keyword is disallowed.';

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'no-only-filter',
        description: 'Helps to keep your imports in order.',
        options: null,
        optionsDescription: null,
        type: 'functionality',
        typescriptOnly: false,
        hasFix: false,
        requiresTypeInfo: false
      };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    protected visitSourceFile(node: ts.SourceFile) {
        if (node.text.match(/\.only\./g)) {
            const errorStart = node.text.indexOf('.only');
            this.addFailureAt(errorStart, '.only'.length, Rule.FAILURE_STRING);
        }

        super.visitSourceFile(node);
    }
}
```

There are a few conventions that need to be considered in order for the rule to work. The name of the class should be Rule and it should inherit from `Lint.Rules.AbstractRule`. The name of the file itself should have Rule as suffix as well.

When ready with the logic you should compile the source file to a Javscipt: ```tsc noFilterRule.ts```

In your tslint.json configuration file add ```"rulesDirectory": "./tslint-rules"``` and also turn the rule on under rules section like that: ```"no-only-filter": true,```

TS lint should now pickup the new rule and report any violations. The position of the error reported will be as calculated in the ```errorStart``` variable passed to ```addFailureAt``` method.
