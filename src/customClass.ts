import Accessor from "@arcgis/core/core/Accessor";
import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

@subclass("custom.DropDownData")
export class DropDownData extends Accessor {
  @property({ readOnly: true })
  featureLayers: [FeatureLayer, FeatureLayer?] | any;

  @property({ readOnly: true })
  fieldNames: [string, string?, string?] | any;

  dropDownQuery = async () => {
    // ################### One Feature Layer ################### //
    if (this.featureLayers.length === 1) {
      // One dropdown (= one field):-----------------------
      if (
        this.fieldNames[1] === undefined &&
        this.fieldNames[2] === undefined
      ) {
        var query11 = this.featureLayers[0].createQuery();
        query11.outFields = ["*"];
        // query11.outFields = [this.fieldNames[0]];
        query11.orderByFields = [this.fieldNames[0]];
        query11.groupByFieldsForStatistics = [this.fieldNames[0]];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query11)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              return Object.assign({
                field1: field1,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex((item: any) => item.field1 === val.field1) ===
                index
            );
            return pair;
          });

        const pairs = await pairQ;

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          return Object.assign({
            field1: field1, // field1 = cp
          });
        });
        return field1Array;

        // Two dropdowns (= two fields):-----------------------
      } else if (this.fieldNames[2] === undefined) {
        var query12 = this.featureLayers[0].createQuery();
        query12.outFields = ["*"];
        query12.orderByFields = [this.fieldNames[0], this.fieldNames[1]];
        query12.groupByFieldsForStatistics = [
          this.fieldNames[0],
          this.fieldNames[1],
        ];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query12)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              return Object.assign({
                field1: field1,
                field2: field2,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 && item.field2 === val.field2
                ) === index
            );
            return pair;
          });

        const pairs = await pairQ;

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          const filterField1 = pairs.filter(
            (emp: any) => emp.field1 === field1
          );
          const uniqueField2 = filterField1
            .map((item: any) => item.field2)
            .filter(
              (field2: any, index: any, emp: any) =>
                emp.indexOf(field2) === index
            );

          // 3.2. Unique values for field3 corresponding to field1 and field2
          // eslint-disable-next-line array-callback-return
          const field2Array = uniqueField2.map((field2: any, index: any) => {
            return Object.assign({
              name: field2,
            });
          });
          return Object.assign({
            field1: field1, // field1 = cp
            field2: field2Array, // field2 = company
          });
        });
        return field1Array;

        // Three dropdowns (= three fields):-----------------------
      } else {
        // 1. Pairs for 1st feature layer
        var query13 = this.featureLayers[0].createQuery();
        query13.outFields = ["*"];
        query13.orderByFields = [this.fieldNames[0], this.fieldNames[1]];
        query13.groupByFieldsForStatistics = [
          this.fieldNames[0],
          this.fieldNames[1],
        ];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query13)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              const field3 = attributes[this.fieldNames[2]];
              return Object.assign({
                field1: field1,
                field2: field2,
                field3: field3,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 &&
                    item.field2 === val.field2 &&
                    item.field3 === val.field3
                ) === index
            );
            return pair;
          });

        const pairs = await pairQ;

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          const filterField1 = pairs.filter(
            (emp: any) => emp.field1 === field1
          );
          const uniqueField2 = filterField1
            .map((item: any) => item.field2)
            .filter(
              (field2: any, index: any, emp: any) =>
                emp.indexOf(field2) === index
            );

          // 3.2. Unique values for field3 corresponding to field1 and field2
          // eslint-disable-next-line array-callback-return
          const field2Array = uniqueField2.map((field2: any, index: any) => {
            const filterField2 = pairs.filter(
              (emp: any) => emp.field1 === field1 && emp.field2 === field2
            );

            const uniqueField3 = filterField2
              .map((item: any) => item.field3)
              .filter(
                (field3: any, index: any, emp: any) =>
                  emp.indexOf(field3) === index
              );

            // eslint-disable-next-line array-callback-return
            const field3Array = uniqueField3.map((field3: any, index: any) => {
              return Object.assign({
                name: field3, // field3 = typeName (name?)
              });
            });

            return Object.assign({
              name: field2,
              field3: field3Array, // field3 = type
            });
          });
          return Object.assign({
            field1: field1, // field1 = cp
            field2: field2Array, // field2 = company
          });
        });
        return field1Array;
      }
      //
      //
      //
      //
      // ################### Two Feature Layers ################### //
    } else {
      // One dropdown (= one field):-----------------------
      if (
        this.fieldNames[1] === undefined &&
        this.fieldNames[2] === undefined
      ) {
        var query21p = this.featureLayers[0].createQuery();
        query21p.outFields = ["*"];
        query21p.orderByFields = [this.fieldNames[0]];
        query21p.groupByFieldsForStatistics = [this.fieldNames[0]];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query21p)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              return Object.assign({
                field1: field1,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex((item: any) => item.field1 === val.field1) ===
                index
            );
            return pair;
          });

        // 2. Pairs for 2nd feature layer
        var query21l = this.featureLayers[1].createQuery();
        query21l.outFields = ["*"];

        const pairQ2: any = this.featureLayers[1]
          .queryFeatures(query21l)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              return Object.assign({
                field1: field1,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex((item: any) => item.field1 === val.field1) ===
                index
            );
            return pair;
          });

        // 3. Concatenate two pairs
        const pair1 = await pairQ;
        const pair2 = await pairQ2;
        const pairs = pair1.concat(pair2);

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          return Object.assign({
            field1: field1, // field1 = cp
          });
        });
        return field1Array;

        // Two dropdowns (= two fields):-----------------------
      } else if (this.fieldNames[2] === undefined) {
        var query22p = this.featureLayers[0].createQuery();
        query22p.outFields = ["*"];
        query22p.orderByFields = [this.fieldNames[0], this.fieldNames[1]];
        query22p.groupByFieldsForStatistics = [
          this.fieldNames[0],
          this.fieldNames[1],
        ];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query22p)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              return Object.assign({
                field1: field1,
                field2: field2,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 && item.field2 === val.field2
                ) === index
            );
            return pair;
          });

        // 2. Pairs for 2nd feature layer
        var query22l = this.featureLayers[1].createQuery();
        query22l.outFields = ["*"];

        const pairQ2: any = this.featureLayers[1]
          .queryFeatures(query22l)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              return Object.assign({
                field1: field1,
                field2: field2,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 && item.field2 === val.field2
                ) === index
            );
            return pair;
          });

        // 3. Concatenate two pairs
        const pair1 = await pairQ;
        const pair2 = await pairQ2;
        const pairs = pair1.concat(pair2);

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          const filterField1 = pairs.filter(
            (emp: any) => emp.field1 === field1
          );
          const uniqueField2 = filterField1
            .map((item: any) => item.field2)
            .filter(
              (field2: any, index: any, emp: any) =>
                emp.indexOf(field2) === index
            );

          // 3.2. Unique values for field3 corresponding to field1 and field2
          // eslint-disable-next-line array-callback-return
          const field2Array = uniqueField2.map((field2: any, index: any) => {
            return Object.assign({
              name: field2,
            });
          });
          return Object.assign({
            field1: field1, // field1 = cp
            field2: field2Array, // field2 = company
          });
        });
        return field1Array;

        // Three dropdowns (= three fields):-----------------------
      } else {
        // 1. Pairs for 1st feature layer
        var query23p = this.featureLayers[0].createQuery();
        query23p.outFields = ["*"];
        query23p.orderByFields = [this.fieldNames[0], this.fieldNames[1]];
        query23p.groupByFieldsForStatistics = [
          this.fieldNames[0],
          this.fieldNames[1],
        ];

        const pairQ: any = this.featureLayers[0]
          .queryFeatures(query23p)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              const field3 = attributes[this.fieldNames[2]];
              return Object.assign({
                field1: field1,
                field2: field2,
                field3: field3,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 &&
                    item.field2 === val.field2 &&
                    item.field3 === val.field3
                ) === index
            );
            return pair;
          });

        // 2. Pairs for 2nd feature layer
        var query23l = this.featureLayers[1].createQuery();
        query23l.outFields = ["*"];

        const pairQ2: any = this.featureLayers[1]
          .queryFeatures(query23l)
          .then((response: any) => {
            var stats = response.features;
            const values = stats.map((result: any, index: any) => {
              const attributes = result.attributes;
              const field1 = attributes[this.fieldNames[0]];
              const field2 = attributes[this.fieldNames[1]];
              const field3 = attributes[this.fieldNames[2]];
              return Object.assign({
                field1: field1,
                field2: field2,
                field3: field3,
              });
            });

            // 1. Get a pair
            const pair = values.filter(
              (val: any, index: any) =>
                values.findIndex(
                  (item: any) =>
                    item.field1 === val.field1 &&
                    item.field2 === val.field2 &&
                    item.field3 === val.field3
                ) === index
            );
            return pair;
          });

        // 3. Concatenate two pairs
        const pair1 = await pairQ;
        const pair2 = await pairQ2;
        const pairs = pair1.concat(pair2);

        // 2. Unique falues for field1
        const uniqueField1 = pairs
          .map((item: any) => item.field1)
          .filter(
            (field1: any, index: any, emp: any) => emp.indexOf(field1) === index
          );

        // 3. Compile for all the fields:
        const field1Array = uniqueField1.map((field1: any, index: number) => {
          const filterField1 = pairs.filter(
            (emp: any) => emp.field1 === field1
          );
          const uniqueField2 = filterField1
            .map((item: any) => item.field2)
            .filter(
              (field2: any, index: any, emp: any) =>
                emp.indexOf(field2) === index
            );

          // 3.2. Unique values for field3 corresponding to field1 and field2
          // eslint-disable-next-line array-callback-return
          const field2Array = uniqueField2.map((field2: any, index: any) => {
            const filterField2 = pairs.filter(
              (emp: any) => emp.field1 === field1 && emp.field2 === field2
            );

            const uniqueField3 = filterField2
              .map((item: any) => item.field3)
              .filter(
                (field3: any, index: any, emp: any) =>
                  emp.indexOf(field3) === index
              );

            // eslint-disable-next-line array-callback-return
            const field3Array = uniqueField3.map((field3: any, index: any) => {
              return Object.assign({
                name: field3, // field3 = typeName (name?)
              });
            });

            return Object.assign({
              name: field2,
              field3: field3Array, // field3 = type
            });
          });
          return Object.assign({
            field1: field1, // field1 = cp
            field2: field2Array, // field2 = company
          });
        });
        return field1Array;
      }
    }
  }; // end of dropdown method
}
