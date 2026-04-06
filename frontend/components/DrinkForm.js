'use client';

import { useState, useRef } from 'react';

const DRINKS = [
  { value: 'beer', label: 'Beer', points: 1 },
  { value: 'cocktail', label: 'Cocktail', points: 2 },
  { value: 'shot', label: 'Shot', points: 3 },
];

export default function DrinkForm({ onSubmit }) {
  const [drinkType, setDrinkType] = useState('beer');
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef(null);

  const selectedDrink = DRINKS.find((d) => d.value === drinkType);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file');
      return;
    }
    setPhotoError('');
    setPhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photo) {
      setPhotoError('A photo is required to log a drink');
      return;
    }
    // Photo is validated client-side only – never uploaded
    onSubmit({ drinkType });
    setPhoto(null);
    setPhotoError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="drink-form"
      className="grid gap-4 rounded-xl border border-zinc-300 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-bold text-zinc-900">Log a drink</h2>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-zinc-800 mb-1">Drink type</legend>
        <div className="grid grid-cols-3 gap-2">
          {DRINKS.map((d) => (
            <label
              key={d.value}
              className={`flex flex-col items-center rounded-lg border-2 px-2 py-3 cursor-pointer transition-colors ${
                drinkType === d.value
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
              }`}
            >
              <input
                type="radio"
                name="drinkType"
                value={d.value}
                checked={drinkType === d.value}
                onChange={() => setDrinkType(d.value)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{d.label}</span>
              <span className="text-xs opacity-75 mt-0.5">+{d.points} pt{d.points !== 1 ? 's' : ''}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1 text-sm font-medium text-zinc-800">
        Photo proof
        <div
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
            photo ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'
          }`}
        >
          {photo ? (
            <span className="text-sm text-zinc-700 text-center break-all">{photo.name}</span>
          ) : (
            <>
              <span className="text-zinc-400 text-2xl mb-1">↑</span>
              <span className="text-sm text-zinc-500">Tap to upload a photo</span>
              <span className="text-xs text-zinc-400 mt-0.5">Not stored – just to prove you're drinking</span>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="sr-only"
        />
        {photoError && <p className="text-xs text-red-600">{photoError}</p>}
      </label>

      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        Log {selectedDrink?.label} (+{selectedDrink?.points} pt{selectedDrink?.points !== 1 ? 's' : ''})
      </button>
    </form>
  );
}
